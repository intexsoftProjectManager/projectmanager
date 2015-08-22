package by.intexsoft.projectmanager.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;


@Entity
@Table (name="iterations")
public class Iteration {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="iteration_id", unique=true, nullable=false)
	@PrimaryKeyJoinColumn
	public Long id;
	
	@Column(nullable=false)
	public String name;
	
	public String description;
		
	@ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
	@JoinTable(name = "user_iteration", 
			joinColumns = { 
				@JoinColumn(name = "iteration_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "user_id", nullable = false) })
	public List<User> users = new ArrayList<User>();
	
	@Temporal(TemporalType.TIMESTAMP)
	public Date startDate;
	@Temporal(TemporalType.TIMESTAMP)
	public Date finishDate;
	
	public Long color;
	
	public boolean isComplete = false;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id", nullable = false)
	public Project project;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "iteration", 
			cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
	public List<Task> tasks = new ArrayList<Task>();
	
}
