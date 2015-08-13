package by.intexsoft.projectmanager.domain;

import java.util.Date;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

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
	
	@Column(nullable=false)
	public Long priority = 0L;
	
	@ManyToMany(fetch = FetchType.LAZY)
	@JoinTable(name = "user_iteration", 
			joinColumns = { 
				@JoinColumn(name = "iteration_id", nullable = false) }, 
				inverseJoinColumns = { @JoinColumn(name = "user_id", nullable = false) })
	@Cascade({CascadeType.SAVE_UPDATE})
	public List<User> users;
	
	@Temporal(TemporalType.TIMESTAMP)
	public Date startDate;
	@Temporal(TemporalType.TIMESTAMP)
	public Date finishDate;
	
	public Long color;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id", nullable = false)
	public Project project;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "iteration")
	@Cascade({CascadeType.SAVE_UPDATE, CascadeType.DELETE})
	public List<Task> tasks;
	
}
