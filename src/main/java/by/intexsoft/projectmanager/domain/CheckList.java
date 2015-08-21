package by.intexsoft.projectmanager.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.persistence.CascadeType;


@Entity
@Table (name="checklists")
public class CheckList {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="checklist_id", unique=true, nullable=false)
	@PrimaryKeyJoinColumn
	public Long id;
	
	public String comment;
	
	@ManyToMany(fetch = FetchType.LAZY, cascade={CascadeType.MERGE, CascadeType.PERSIST })
	@JoinTable(name = "user_checklist", 
			joinColumns = { 
				@JoinColumn(name = "checklist_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "user_id", nullable = false) })
	public List<User> users = new ArrayList<User>();
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "checkList", cascade={CascadeType.MERGE, CascadeType.PERSIST })
	public List<Step> steps = new ArrayList<Step>();
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "folder_id", nullable = false)
	private Folder folder;
	
	public boolean isFinished = false;
}
